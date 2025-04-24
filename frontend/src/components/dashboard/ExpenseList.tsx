//src/components/dashboard/ExpenseList.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { VStack, Text } from "@chakra-ui/react";
import { expensesApi } from "@/services/api";
import ExpenseCard from "./ExpenseCard";
import Loader from "../shared/Loader";

interface ExpenseListProps {
  groupId: string;
}

export default function ExpenseList({ groupId }: ExpenseListProps) {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", groupId],
    queryFn: () => {
      console.log(expenses)
      return expensesApi.getExpenses(groupId)
    },
  });

  if (isLoading) return <Loader />;
  if (!expenses || expenses.length === 0) return <Text textAlign="center">Нет трат</Text>;

  return (
    <VStack spacing={4} align="stretch" width="full" >
      {expenses.map((expense) => (
        <ExpenseCard key={expense._id} {...expense} groupId={groupId} />
      ))}
    </VStack>
  );
}
