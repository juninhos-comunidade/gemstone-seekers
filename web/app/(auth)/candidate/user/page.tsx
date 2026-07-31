import { UserProfile } from "@/components/UserProfile/UserProfile";
import { MOCK_CANDIDATE_USER } from "@/lib/mocks/userMock";

export default function CandidateUserPage() {
  return <UserProfile user={MOCK_CANDIDATE_USER} />;
}
