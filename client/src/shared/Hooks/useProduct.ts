import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../graphql/product/queries";
import { INCREMENT_VIEWS } from "../../graphql/product/mutations";
import { useEffect, useRef } from "react";

export const useProduct = (id: string, view: boolean) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const [incrementView] = useMutation(INCREMENT_VIEWS);
  const hasIncremented = useRef(false);
  useEffect(() => {
    if (!data || !data?.getProductById || !view || !id || hasIncremented.current) return;
    incrementView({ variables: { id } });
    hasIncremented.current = true;
  }, [data, data?.getProductById, id, view, incrementView]);

  return {
    product: data?.getProductById,
    loading,
    error,
  };
};
