import { RequestError } from '@components';
import { selectIngredientsState } from '@slices/ingredientsSlice';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const { ingredients, isLoading, isLoaded, error } =
    useSelector(selectIngredientsState);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (isLoading || (!isLoaded && !error)) {
    return <Preloader />;
  }
  if (error) return <RequestError message={error} />;
  if (!ingredientData)
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
