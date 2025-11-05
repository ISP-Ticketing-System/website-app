export default function AuthLayout({ children }: Readonly<Props>) {
  return <>{children}</>;
}

type Props = {
  children: React.ReactNode;
};
