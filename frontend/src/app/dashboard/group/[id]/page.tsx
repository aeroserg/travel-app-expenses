import GroupPageClient from "@/components/dashboard/GroupPageClient";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
  <GroupPageClient id={id} />
);
}
