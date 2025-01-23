import { Outlet, Navigate } from "react-router-dom";

function AuthLayout() {
  const isAuthenticated = false;
  return isAuthenticated ? (
    <Navigate to={"/"} />
  ) : (
    <>
      <img
      src="/assets/images/bg_final.jpg"
      className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
    </>
  );
}

export default AuthLayout;
