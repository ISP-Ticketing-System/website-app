import { ProfileProvider } from "@/context/profile-context";

export default function MainLayout({ children }: Readonly<Props>) {
  return <ProfileProvider>{children};</ProfileProvider>;
}

type Props = {
  children: React.ReactNode;
};
