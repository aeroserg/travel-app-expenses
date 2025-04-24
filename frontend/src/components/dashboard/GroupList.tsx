import { Box, Button, Text, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "../../services/api";
import { Group } from "@/types/group.interface";
import { useRouter } from "next/navigation";
import { FiLogOut, FiArrowRight, FiClipboard } from "react-icons/fi";
import { useDisclosure, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { useState } from "react";

interface GroupListProps {
  groups: Group[];
  isLoading: boolean;
}

export default function GroupList({ groups, isLoading }: GroupListProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Покинуть группу
  const leaveGroupMutation = useMutation({
    mutationFn: (groupId: string) => groupsApi.leaveGroup(groupId),
    onSuccess: () => {
      toast({
        title: "Вы покинули группу.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Ошибка!",
        description: "Не удалось покинуть группу",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) =>
      groupsApi.updateGroup(groupId, name),
    onSuccess: () => {
      toast({
        title: "Название группы обновлено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      editModal.onClose();
    },
    onError: () => {
      toast({
        title: "Ошибка!",
        description: "Не удалось обновить название",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Код скопирован!",
      description: `Пригласительный код: ${code}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const editModal = useDisclosure();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState("");

  if (isLoading) return <Spinner />;

  return (
    <Box>
      {groups.length === 0 ? (
        <Text>Вы не состоите ни в одной группе.</Text>
      ) : (
        groups.map((group) => (
          <Box key={group._id} p={4} borderWidth="1px" borderRadius="md" mb={4} display="flex" alignItems="center" justifyContent="space-between">
            <Box>
             
                <Text fontSize="lg">{group.name}</Text>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Text fontSize="sm" color="gray.500">Код: {group.code}</Text>
                    <IconButton
                      size="sm"
                      aria-label="Копировать код"
                      icon={<FiClipboard />}
                      onClick={() => handleCopyCode(group.code)}
                    />
              </Box>

            </Box>
            
            <Box display="flex" gap={2}>
              {/* Кнопка "Открыть" */}
              <Button size="sm" colorScheme="blue" onClick={() => router.push(`/dashboard/group/${group._id}`)}>
                Открыть <FiArrowRight style={{ marginLeft: "5px" }} />
              </Button>

              {/* Кнопка "Покинуть" */}
              <IconButton
                size="sm"
                aria-label="Покинуть группу"
                colorScheme="red"
                icon={<FiLogOut />}
                onClick={() => leaveGroupMutation.mutate(group._id)}
                isLoading={leaveGroupMutation.isPending}
              />

              <Button
                size="sm"
                colorScheme="yellow"
                onClick={() => {
                  setSelectedGroupId(group._id);
                  setNewGroupName(group.name);
                  editModal.onOpen();
                }}
              >
                Редактировать
              </Button>


            </Box>
          </Box>
        ))
      )}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Изменить название группы</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Input
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
        placeholder="Новое название"
      />
    </ModalBody>
    <ModalFooter>
      <Button
        colorScheme="blue"
        onClick={() =>
          updateGroupMutation.mutate({
            groupId: selectedGroupId!,
            name: newGroupName,
          })
        }
        isLoading={updateGroupMutation.isPending}
      >
        Сохранить
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
    
  );
}
