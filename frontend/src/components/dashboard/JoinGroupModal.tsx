import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { groupsApi } from "../../services/api";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
  const [groupId, setGroupId] = useState("");
  const toast = useToast();

  // Мутация для присоединения к группе
  const joinGroupMutation = useMutation({
    mutationFn: () => groupsApi.joinGroup(groupId),
    onSuccess: (data) => {
      toast({
        title: "Успешно!",
        description: "Вы присоединились к группе.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log(data);
      setGroupId("");
      onClose();
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Ошибка!",
        description: "Неверный код группы",
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
        <ModalHeader>Присоединиться к группе</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Введите ID группы"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={2}>Отмена</Button>
          <Button
            colorScheme="green"
            onClick={() => joinGroupMutation.mutate()}
            isDisabled={!groupId}
            isLoading={joinGroupMutation.isPending}
          >
            Присоединиться
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
