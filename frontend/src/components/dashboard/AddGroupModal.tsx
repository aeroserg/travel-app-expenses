"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast } from "@chakra-ui/react";
import { groupsApi } from "@/services/api";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddGroupModal({ isOpen, onClose }: AddGroupModalProps) {
  const [name, setName] = useState("");
  const toast = useToast();

  const createGroupMutation = useMutation({
    mutationFn: () => {
      if (!name) {
        throw new Error("Название группы не может быть пустым");
      }
      if (!navigator.onLine) {
        throw new Error("Создавать группы можно только онлайн");
      }
      return groupsApi.createGroup(name);
    },
    onSuccess: () => {
      toast({
        title: "Группа создана!",
        description: `Группа "${name}" успешно добавлена.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error?.message || "Не удалось создать группу.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Создать группу</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Название группы" value={name} onChange={(e) => setName(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => createGroupMutation.mutate()} isLoading={createGroupMutation.isPending}>
            Создать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
