//src/components/dashboard/GroupPageClient.tsx

"use client";

import { useEffect, useState } from "react";
import { Box, Heading, VStack, Button } from "@chakra-ui/react";
import ExpenseList from "@/components/dashboard/ExpenseList";
import AddExpenseModal from "@/components/dashboard/AddExpenseModal";
import { useRouter } from "next/navigation";
import { groupsApi } from "@/services/api";
import DebtList from "./DebtList";

interface GroupPageClientProps {
  id: string;
}

export default function GroupPageClient({ id }: GroupPageClientProps) {
  const [groupName, setGroupName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchGroupData() {
      try {
        const group = await groupsApi.getGroupById(id);
        setGroupName(group.name);
      } catch (error) {
        console.error("Ошибка загрузки группы:", error);
        setGroupName("Ошибка загрузки");
      }
    }

    fetchGroupData();
  }, [id]);

  return (
    <Box p={6}>
      <Heading size="lg">{groupName || "Загрузка..."}</Heading>
      <VStack align="stretch" spacing={4}>
        <DebtList groupId={id} />
        <ExpenseList groupId={id} />
        <Button colorScheme="blue" onClick={() => setIsModalOpen(true)}>
          Добавить трату
        </Button>
        <Button colorScheme="teal" onClick={() => router.push(`/dashboard/group/${id}/expenses`)}>
          Управление тратами
        </Button>
      </VStack>
      <AddExpenseModal groupId={id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}
