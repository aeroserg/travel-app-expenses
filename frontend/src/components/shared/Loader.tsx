import { Spinner, Center } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center height="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
