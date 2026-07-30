import Image from "next/image";
// import {
//   Book,
//   Briefcase,
//   GraduationCap,
//   FolderGit2,
//   Globe,
// } from "lucide-react";
import {
  FaBook,
  FaBriefcase,
  FaGraduationCap,
  FaFolderOpen,
  FaGlobe,
} from "react-icons/fa";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { UserMock } from "@/lib/mocks/userMock";

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-semibold">{children}</h2>
    </div>
  );
}

interface UserProfileProps {
  user: UserMock;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 pt-24 pb-8">
      <div className="flex items-center gap-4">
        <Image
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name,
          )}&format=png`}
          alt={`Avatar de ${user.name}`}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.role}</p>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={user.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground"
            >
              <FaGithub className="size-4" />
            </a>
            <a
              href={user.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground"
            >
              <FaLinkedin className="size-4" />
            </a>
            <a
              href={user.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfólio"
              className="text-muted-foreground hover:text-foreground"
            >
              <FaGlobe className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Sobre</h2>
        <p className="text-muted-foreground">{user.bio}</p>
      </section>

      <section>
        <SectionTitle icon={<FaBriefcase className="size-5" />}>
          Experiência Profissional
        </SectionTitle>
        <div className="space-y-4">
          {user.experiences.map((exp) => (
            <div
              key={exp.id}
              className="border-primary space-y-1 border-l-2 pl-4"
            >
              <h3 className="font-medium">
                {exp.role}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  — {exp.company}
                </span>
              </h3>
              <span className="text-muted-foreground text-xs">
                {exp.period}
              </span>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={<FaGraduationCap className="size-5" />}>
          Educação
        </SectionTitle>
        <div className="space-y-4">
          {user.education.map((edu) => (
            <div
              key={edu.id}
              className="border-primary space-y-1 border-l-2 pl-4"
            >
              <h3 className="font-medium">
                {edu.institution}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  — {edu.degree}
                </span>
              </h3>
              <span className="text-muted-foreground text-xs">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={<FaBook className="size-5" />}>
          Certificações
        </SectionTitle>
        <div className="space-y-4">
          {user.certifications.map((cert) => (
            <div
              key={cert.id}
              className="border-primary space-y-1 border-l-2 pl-4"
            >
              <h3 className="font-medium">
                {cert.title}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  — {cert.issuer}
                </span>
              </h3>
              <span className="text-muted-foreground text-xs">{cert.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={<FaFolderOpen className="size-5" />}>
          Projetos
        </SectionTitle>
        <div className="space-y-4">
          {user.projects.map((proj) => (
            <div
              key={proj.id}
              className="border-primary space-y-1 border-l-2 pl-4"
            >
              <h3 className="font-medium">
                {proj.title}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  — {proj.description}
                </span>
              </h3>
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-xs underline underline-offset-2"
              >
                {proj.link}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
