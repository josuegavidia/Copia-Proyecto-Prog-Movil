import { configureStore, Middleware } from '@reduxjs/toolkit';
import squadReducer from './slices/squadSlice';

// Middleware para registrar en consola el flujo de datos y cambios en el estado de Redux
const reduxLoggerMiddleware: Middleware = (storeAPI) => (next) => (action: any) => {
  if (action && typeof action.type === 'string' && !action.type.startsWith('squad/setAchievementsModalVisible')) {
    const prevState = storeAPI.getState();
    const result = next(action);
    const nextState = storeAPI.getState();

    console.log(`\n======================================================`);
    console.log(`[REDUX DISPATCH] Accion: ${action.type}`);
    if (action.payload !== undefined) {
      console.log(`[PAYLOAD]:`, typeof action.payload === 'object' ? JSON.stringify(action.payload, null, 2) : action.payload);
    }
    console.log(`[ESTADO ANTERIOR]: Monedas = ${prevState.squad?.coins}, Cartas = ${prevState.squad?.cards?.length || 0}`);
    console.log(`[NUEVO ESTADO REDUX]: Monedas = ${nextState.squad?.coins}, Cartas = ${nextState.squad?.cards?.length || 0}, Usuario Autenticado = ${nextState.squad?.isAuth}`);
    console.log(`======================================================\n`);

    return result;
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    squad: squadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(reduxLoggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
