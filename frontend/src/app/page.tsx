import { Box, Heading, Text } from "@chakra-ui/react";
import {Link} from "@chakra-ui/react";

export default function HomePage() {
  return (
    <Box textAlign="center" p={8}>
      <Heading size="xl">Трекер финансов в путешествиях</Heading>
      <Text mt={4}>Отслеживай расходы, даже без интернета!</Text>
      <Link as={Link} href="/auth/login" colorScheme="blue" mt={6}>
        Войти
      </Link>
      <Link as={Link} href="/auth/register" colorScheme="blue" mt={6}>
        Зарегистрироваться
      </Link>
    </Box>
  );
}
