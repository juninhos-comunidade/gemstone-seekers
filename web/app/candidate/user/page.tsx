import Image from "next/image";
import { MOCK_USER } from "@/lib/mocks/userMock";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="flex items-center gap-4">
        <Image
          src={MOCK_USER.avatarUrl}
          alt={MOCK_USER.name}
          className="h-20 w-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
          <p className="text-muted-foreground">{MOCK_USER.role}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Sobre</h2>
        <p className="text-muted-foreground">{MOCK_USER.bio}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Experiência Profissional</h2>
        {MOCK_USER.experiences.map((exp) => (
          <div
            key={exp.id}
            className="border-primary space-y-1 border-l-2 pl-4"
          >
            <h3 className="font-medium">
              {exp.role} —{" "}
              <span className="text-muted-foreground text-sm font-normal">
                {exp.company}
              </span>
            </h3>
            <span className="text-muted-foreground text-xs">{exp.period}</span>
            <p className="text-sm">{exp.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
