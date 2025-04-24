"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // ✅ Берем параметры из маршрута
import { Box, Heading, VStack, Button } from "@chakra-ui/react";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import ExpenseList from "@/components/dashboard/ExpenseList";

export default function ExpensesPage() {
  const params = useParams(); // ✅ Получаем `groupId` из URL
  const groupId = params.id as string; // ✅ Преобразуем в строку
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box p={6}>
      <Heading size="lg">Траты</Heading>
      <VStack align="stretch" spacing={4}>
        <ExpenseList groupId={groupId} />
        <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
          Добавить трату
        </Button>
      </VStack>
      <AddExpenseModal groupId={groupId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
