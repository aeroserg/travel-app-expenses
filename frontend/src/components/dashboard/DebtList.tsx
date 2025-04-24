"use client";

import { useQuery } from "@tanstack/react-query";
import { Box, VStack, Text } from "@chakra-ui/react";
import { debtsApi } from "@/services/api";
import Loader from "../shared/Loader";
import { formatCurrency } from "@/utils/format-currency";

interface DebtListProps {
  groupId: string;
}

export default function DebtList({ groupId }: DebtListProps) {
  const { data: debts, isLoading } = useQuery({
    queryKey: ["debts", groupId],
    queryFn: () => debtsApi.getDebts(groupId),
  });

  if (isLoading) return <Loader />;
  if (!debts || debts.length === 0) return <Text textAlign="center">Нет долгов</Text>;

  return (
    <Box p={4} bg="white" shadow="md" borderRadius="md" width="full">
      <Text fontWeight="bold" mb={2} color={"#000000"}>Текущие долги</Text>
      <VStack align="stretch" spacing={2}>
        {debts.map(({ _id, from, to, amount, currency }) => (
          <Box color={"#000000"} key={_id} p={2} bg="gray.50" borderRadius="md">
            <Text>
              <strong>{from.name}</strong> должен <strong>{to.name}</strong>: {formatCurrency(amount, currency as "USD" | "EUR" | "RUB")}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
