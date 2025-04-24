"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Select,
  Checkbox,
  VStack,
  Text,
} from "@chakra-ui/react";
import { expensesApi, groupsApi } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { registerSync } from "@/hooks/useSync"; // Регистрация Background Sync
import { saveExpenseToCache } from "@/hooks/useCache"; // Функция сохранения запроса в кэш

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export default function AddExpenseModal({ isOpen, onClose, groupId }: AddExpenseModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"RUB" | "USD" | "EUR">("RUB");
  const [debtors, setDebtors] = useState<string[]>([]);
  const toast = useToast();

  // Загружаем список участников группы
  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => groupsApi.getGroup(groupId),
    enabled: isOpen, // Загружаем только когда модалка открыта
  });

  // Добавляем/удаляем должников
  const toggleDebtor = (userId: string) => {
    setDebtors((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Мутация для отправки данных на сервер
  const addExpenseMutation = useMutation({
    mutationFn: async () => {
      if (!user?._id) throw new Error("Ошибка аутентификации");

      const expenseData = {
        groupId,
        name,
        amount: parseFloat(amount),
        currency,
        paidBy: user._id,
        debtors,
      };

      if (navigator.onLine) {
        // ✅ Если есть интернет — отправляем на сервер
        return expensesApi.addExpense(groupId, name, parseFloat(amount), currency, user._id, debtors);
      } else {
        // 🛑 Если оффлайн — сохраняем запрос в Cache Storage и регистрируем Background Sync
        await saveExpenseToCache(expenseData);
        await registerSync();
        throw new Error("Вы оффлайн. Трата сохранена и будет отправлена позже.");
      }
    },
    onSuccess: () => {
      toast({
        title: "Трата добавлена!",
        description: `Трата "${name}" успешно добавлена.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Оффлайн режим",
        description: error.message || "Трата сохранена и будет отправлена позже.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Добавить трату</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Сумма"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            mt={2}
          />
          <Select mt={2} value={currency} onChange={(e) => setCurrency(e.target.value as "RUB" | "USD" | "EUR")}>
            <option value="RUB">₽ RUB</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </Select>

          <Text mt={4} fontWeight="bold">
            {Number(amount) > 0 && `Трату в размере ${amount} ${currency} делим между:`}
          </Text>
          {isLoadingGroup ? (
            <Text>Загрузка участников...</Text>
          ) : (
            <VStack align="start" spacing={1}>
              {group?.members.map((member) => (
                <Checkbox
                  key={member._id}
                  isChecked={debtors.includes(member._id)}
                  onChange={() => toggleDebtor(member._id)}
                >
                  {member.name}
                </Checkbox>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={() => addExpenseMutation.mutate()}
            isLoading={addExpenseMutation.isPending}
            isDisabled={!name || !amount || debtors.length === 0}
          >
            Добавить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
