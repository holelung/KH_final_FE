const Authenticator = () => {
  return (
    <>
      <div className="w-full min-h-screen h-full bg-saintralightblue font-PyeojinGothicB flex justify-center">
        <div className="w-2xl my-16 p-8 bg-white rounded-xl shadow-md flex flex-col justify-center items-center">
          <section className="text-6xl mt-12">Saintra Logo</section>
          <section className="mt-12 text-6xl flex flex-col gap-6">
            <div className="text-6xl">Login</div>
            <div className="text-2xl text-gray-500 flex justify-center">Welcome!</div>
          </section>
          <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
            <div className="px-24">
              <input id="username" type="text" placeholder="USERNAME" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24">
              <input id="password" type="password" placeholder="PASSWORD" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
          </section>
          <section className="mt-12">
            <button className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl">Login</button>
          </section>
          <section className="my-12 text-lg text-gray-500 flex gap-4">
            <div>Registration</div>
            <div>|</div>
            <div>Reissue Password</div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Authenticator;
