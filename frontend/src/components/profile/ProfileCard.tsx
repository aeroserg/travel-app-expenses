import { Box, Text } from "@chakra-ui/react";

export default function ProfileCard() {
  const user = { name: "Иван Иванов", email: "ivan@example.com" }; // Заглушка, заменить API-запросом

  return (
    <Box p={4} bg="white" shadow="md" borderRadius="md">
      <Text fontWeight="bold" color={'#000000'}>{user.name}</Text>
      <Text fontSize="sm" color="gray.500">{user.email}</Text>
    </Box>
  );
}
