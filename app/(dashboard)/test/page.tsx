import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function TestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test</CardTitle>
        <CardDescription>Les stats seront la </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
