"use client";

import { Flex, Heading, Button, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";

interface HeaderProps {
  onMenuOpen?: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const router = useRouter();

  return (
    <Flex p={3} justifyContent="space-between" alignItems="center" bg="gray.800" color="white">

      <IconButton
        icon={<FiMenu />}
        aria-label="Открыть меню"
        display={{ base: "block", md: "none" }}
        onClick={onMenuOpen}
        pl={3}
        bg="gray.700"
      />

      <Heading size="md">Путешествия</Heading>
      
      <Button onClick={() => router.push("/auth/login")} colorScheme="red" size="sm">
        Выйти
      </Button>
    </Flex>
  );
}
