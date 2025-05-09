import SignInForm from '@/components/signin-form';

export default function SignInPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignInForm />
    </div>
  );
}
