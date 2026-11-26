import { BurgerIngredients, BurgerConstructor, RequestError } from '@components';
import { selectIngredientsState } from '@slices/ingredientsSlice';
import { Preloader } from '@ui';
import { clsx } from 'clsx';

import { useSelector } from '@services/store';

import styles from './constructor-page.module.css';

export const ConstructorPage = (): React.JSX.Element => {
  const { ingredients, isLoading, isLoaded, error } =
    useSelector(selectIngredientsState);
  if (isLoading || (!isLoaded && !error)) return <Preloader />;
  if (error) return <RequestError message={error} />;
  if (!ingredients.length)
    return <p className="text text_type_main-medium p-10">Нет ингредиентов</p>;
  return (
    <main className={styles.containerMain}>
      <h1 className={clsx(styles.title, 'text text_type_main-large mt-10 mb-5 pl-5')}>
        Соберите бургер
      </h1>
      <div className={clsx(styles.main, 'pl-5 pr-5')}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
