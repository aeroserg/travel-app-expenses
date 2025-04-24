"use client";

import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";
import MobileMenu from "@/components/shared/MobileMenu";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js').then((registration) => {
  //       console.log('Service Worker зарегистрирован:', registration);
  //     }).catch((error) => {
  //       console.error('Ошибка регистрации Service Worker:', error);
  //     });
  //   }
  // }, []);

  // const isOnline = useNetworkStatus();

  return (
    <Flex height="100vh">
      {/* <Box>Статус сети: {isOnline ? "🟢 Онлайн" : "🔴 Оффлайн"}</Box> */}
      {/* Мобильное меню */}
      <MobileMenu isOpen={isOpen} onClose={onClose} />
      
      {/* Боковое меню (скрывается на мобильных) */}
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar />
      </Box>
      
      <Box flex="1" overflowY="auto" bg="gray.900" color="gray.100">
        <Header onMenuOpen={onOpen} />
        <Box p={4}>{children}</Box>
      </Box>
    </Flex>
  );
}
