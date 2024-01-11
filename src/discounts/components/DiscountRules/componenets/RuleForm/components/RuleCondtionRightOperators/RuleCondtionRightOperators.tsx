import { Multiselect } from "@dashboard/components/Combobox";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context/consumer";
import { Rule } from "@dashboard/discounts/models";
import { Input, RangeInput } from "@saleor/macaw-ui-next";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

interface RuleCondtionRightOperatorsProps {
  conditionIndex: number;
  disabled: boolean;
}

export const RuleCondtionRightOperators = ({
  conditionIndex,
  disabled,
}: RuleCondtionRightOperatorsProps) => {
  const { watch } = useFormContext<Rule>();
  const condition = watch(`conditions.${conditionIndex}`);

  const { getFetchProps, getConditionInputTypeByLabel } =
    useDiscountRulesContext();
  const inputType = getConditionInputTypeByLabel(
    condition.name,
    condition.type,
  );

  const ruleConditionValuesFieldName =
    `conditions.${conditionIndex}.values` as const;

  const { field: valuesField } = useController<
    Rule,
    typeof ruleConditionValuesFieldName
  >({
    name: ruleConditionValuesFieldName,
  });

  if (inputType === "multiselect") {
    const fetchProps = getFetchProps(condition.name);

    if (fetchProps) {
      const { fetch, options, fetchMoreProps } = fetchProps;

      return (
        <Multiselect
          size="medium"
          data-test-id="rule-values"
          value={condition.values as any}
          fetchOptions={fetch}
          fetchMore={fetchMoreProps}
          options={options ?? []}
          onChange={valuesField.onChange}
          onBlur={valuesField.onBlur}
          disabled={disabled}
        />
      );
    }
  }

  if (inputType === "number") {
    return (
      <Input
        type="number"
        value={(condition.values?.[0] || "") as string}
        onChange={valuesField.onChange}
        disabled={disabled}
      />
    );
  }

  if (inputType === "number.range") {
    return (
      <RangeInput
        value={condition.values as any}
        onChange={valuesField.onChange}
        type="number"
        disabled={disabled}
        width="100%"
      />
    );
  }

  return (
    <Input
      size="medium"
      data-test-id="rule-values"
      value={(condition.values?.[0] || "") as string}
      onChange={valuesField.onChange}
      onBlur={valuesField.onBlur}
      disabled={disabled}
    />
  );
};
