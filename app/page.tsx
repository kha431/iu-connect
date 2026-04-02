import { redirect } from 'next/navigation';

export default function HomePage() {
  // تحويل المستخدم مباشرة إلى صفحة السوق أول ما يفتح الموقع
  redirect('/market');
}