import { Spinner, Center } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Center height="100vh" id='loader' data-testid='loader'>
      <Spinner size="xl" />
    </Center>
  );
}
