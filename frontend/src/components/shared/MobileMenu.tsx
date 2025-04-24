"use client";

import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="gray.800">
        <DrawerCloseButton color="white" />
        <DrawerBody p={0}>
          <Sidebar />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
