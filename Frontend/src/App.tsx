import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import { router } from './app/router';

export function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
