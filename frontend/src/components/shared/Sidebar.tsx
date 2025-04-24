"use client";

import { Box, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <Box w="full" maxW="220px" p={4} bg="gray.800" height="100vh" color="white">
      <VStack spacing={3} align="stretch">
        <Button onClick={() => router.push("/dashboard")} colorScheme="blue" size="sm">
          Мои группы
        </Button>
        <Button onClick={() => router.push("/dashboard/profile")} colorScheme="gray" size="sm">
          Профиль
        </Button>
      </VStack>
    </Box>
  );
}
