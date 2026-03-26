import { mockCampaigns } from '@/lib/mock-data';
import CampaignDetail from './campaign-detail';

export function generateStaticParams() {
  return mockCampaigns.map((c) => ({ id: c.id }));
}

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CampaignDetail params={params} />;
}
