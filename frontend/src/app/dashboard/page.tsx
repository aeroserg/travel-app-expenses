"use client";

import { Box, Heading, Button, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { groupsApi } from "../../services/api";
import GroupList from "@/components/dashboard/GroupList";
import AddGroupModal from "@/components/dashboard/AddGroupModal";
import JoinGroupModal from "@/components/dashboard/JoinGroupModal";


export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const joinGroupModal = useDisclosure();


  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: groupsApi.getGroups,
  });


  return (
    <Box>
      
      <Heading size="lg" mb={4}>Мои группы</Heading>

      {/* Кнопки создания и присоединения */}
      <Box display="flex" gap={2} mb={4}>
        <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
          Создать группу
        </Button>
        <Button colorScheme="green" onClick={joinGroupModal.onOpen}>
          Присоединиться к группе
        </Button>
      </Box>

      {/* Список групп */}
      <GroupList groups={groups} isLoading={isLoading} />

      {/* Модальные окна */}
      <AddGroupModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <JoinGroupModal isOpen={joinGroupModal.isOpen} onClose={joinGroupModal.onClose} />
    </Box>
  );
}
