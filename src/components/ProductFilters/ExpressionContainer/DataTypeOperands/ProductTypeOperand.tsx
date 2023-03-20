import { useAutocompleteFiltersProductTypesLazyQuery } from "@dashboard/graphql";
import React from "react";

import { useFilterContext } from "../../State/context";
import { AutocompleteOperand, Value } from "../../State/types";
import { toProductTypeValue } from "./../../State/maps";
import { Autocomplete } from "./../Autocomplete";

export const ProductTypeOperand = ({
  operand,
}: {
  operand: AutocompleteOperand;
}) => {
  const context = useFilterContext();
  const [load, { data }] = useAutocompleteFiltersProductTypesLazyQuery();
  const productTypes = data
    ? data.productTypes.edges.map(toProductTypeValue)
    : [];

  const handleChange = search => {
    load({
      variables: {
        first: 10,
        search,
      },
    });
  };

  const handleSelect = (operand: AutocompleteOperand, selected: Value[]) => {
    context.changeAutocompleteOperand(operand, selected);
  };

  return (
    <Autocomplete
      onSelect={handleSelect}
      operand={operand}
      placeholder="Set category"
      onChange={handleChange}
      items={productTypes}
    />
  );
};
