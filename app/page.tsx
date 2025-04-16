import { MoodItem } from '../components/MoodItem';

export default function SyntheticV0PageForDeployment() {
  return (
    <MoodItem
      mood={{
        id: '1',
        type: 'happy',
        note: 'Example mood',
        timestamp: Date.now(),
      }}
    />
  );
}
