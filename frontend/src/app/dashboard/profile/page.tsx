"use client";

import { useQuery } from "@tanstack/react-query";
import { Box, Heading } from "@chakra-ui/react";
import { groupsApi } from "@/services/api";
import Loader from "@/components/shared/Loader";
import ProfileCard from "@/components/profile/ProfileCard";
import GroupExitList from "@/components/profile/GroupExitList";

export default function ProfilePage() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: groupsApi.getGroups,
  });

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Профиль</Heading>
      <ProfileCard />

      <Heading size="md" mt={6} mb={3}>Мои группы</Heading>
      {isLoading ? <Loader /> : <GroupExitList groups={groups || []} />}
    </Box>
  );
}
