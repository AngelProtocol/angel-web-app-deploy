import {
  MultiColumnTable,
  MultiColumnTableCell,
} from '@terra-dev/neumorphism-ui/components/MultiColumnTable';

export default {
  title: 'components/MultiColumnTable',
};

export const Basic = () => (
  <MultiColumnTable>
    {Array.from({ length: 9 }, (_, i) => (
      <MultiColumnTableCell key={i} label={`Label ${i}`}>
        Value {i}
      </MultiColumnTableCell>
    ))}
  </MultiColumnTable>
);
