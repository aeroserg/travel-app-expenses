//src/components/dashboard/ExpenseCard.tsx
"use client";

import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { expensesApi } from "@/services/api";
import { formatCurrency } from "@/utils/format-currency";

interface ExpenseCardProps {
  _id: string;
  name: string;
  amount: number;
  currency: string;
  paidBy: Record<string, string | number>;
  groupId: string;
}

export default function ExpenseCard({ _id, name, amount, currency, paidBy, groupId }: ExpenseCardProps) {
  const deleteExpenseMutation = useMutation({
    mutationFn: () => expensesApi.deleteExpense(groupId, _id),
    onSuccess: () => {
      alert("Трата удалена");
      window.location.reload();
    },
    onError: (e) => {
      alert(e?.message);
    },
  });

  return (
    <Box p={4} bg="white" shadow="md" borderRadius="md" width="full" >
      <VStack align="start" spacing={2}>
        <Text fontWeight="bold" color={"#000000"}>{name}</Text>
        <Text fontSize="sm" color="gray.500">
          Сумма: {formatCurrency(amount, currency as "USD" | "EUR" | "RUB")} (оплатил {paidBy.name})
        </Text>
        <Button size="sm" colorScheme="red" isLoading={deleteExpenseMutation.isPending} onClick={() => deleteExpenseMutation.mutate()}>
          Удалить
        </Button>
      </VStack>
    </Box>
  );
}
