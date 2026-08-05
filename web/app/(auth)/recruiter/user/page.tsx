import { UserProfile } from "@/components/UserProfile/UserProfile";
import { MOCK_RECRUITER_USER } from "@/lib/mocks/userMock";

export default function RecruiterUserPage() {
  return <UserProfile user={MOCK_RECRUITER_USER} />;
}
