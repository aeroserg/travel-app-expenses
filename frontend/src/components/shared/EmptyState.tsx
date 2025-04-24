import { Box, Text } from "@chakra-ui/react";

export default function EmptyState({ message }: { message: string }) {
  return (
    <Box textAlign="center" p={6}>
      <Text fontSize="lg" color="gray.500">
        {message}
      </Text>
    </Box>
  );
}
