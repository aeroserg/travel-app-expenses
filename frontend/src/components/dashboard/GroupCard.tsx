"use client";

import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface GroupCardProps {
  _id: string;
  name: string;
  membersCount: number;
}

export default function GroupCard({ _id, name, membersCount }: GroupCardProps) {
  const router = useRouter();

  return (
    <Box p={4} bg="white" shadow="md" borderRadius="md" width="full">
      <VStack align="start" spacing={2}>
        <Text fontWeight="bold" color={"#000000"}>{name}</Text>
        <Text fontSize="sm" color="gray.500">
          Участников: {membersCount}
        </Text>
        <Button size="sm" colorScheme="blue" onClick={() => router.push(`/dashboard/group/${_id}`)}>
          Открыть
        </Button>
      </VStack>
    </Box>
  );
}
