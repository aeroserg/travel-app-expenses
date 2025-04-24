"use client";

import { useMutation } from "@tanstack/react-query";
import { Box, Button, VStack, Text, useToast } from "@chakra-ui/react";
import { groupsApi } from "@/services/api";

interface GroupExitListProps {
  groups: { _id: string; name: string }[];
}

export default function GroupExitList({ groups }: GroupExitListProps) {
  const toast = useToast();

  const exitGroupMutation = useMutation({
    mutationFn: async (groupId: string) => groupsApi.leaveGroup(groupId),
    onSuccess: () => {
      toast({
        title: "Вы покинули группу.",
        description: `Вы успешно вышли из группы.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из группы.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <VStack spacing={4} align="stretch">
      {groups.length === 0 ? (
        <Text textAlign="center">Вы не состоите в группах</Text>
      ) : (
        groups.map((group) => (
          <Box key={group._id} p={4} bg="white" shadow="md" borderRadius="md">
            <Text>{group.name}</Text>
            <Button
              size="sm"
              colorScheme="red"
              isLoading={exitGroupMutation.isPending}
              onClick={() => exitGroupMutation.mutate(group._id)}
            >
              Выйти
            </Button>
          </Box>
        ))
      )}
    </VStack>
  );
}
