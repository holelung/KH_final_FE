const Register = () => {
  return (
    <>
      <div className="w-full min-h-screen h-full bg-saintralightblue font-PyeojinGothicB flex justify-center">
        <div className="w-2xl my-16 p-8 bg-white rounded-xl shadow-md flex flex-col justify-center items-center">
          <section className="text-6xl mt-12">Saintra Logo</section>
          <section className="mt-12 text-6xl flex flex-col gap-6">
            <div className="text-6xl">Registration</div>
            <div className="text-2xl text-gray-500 flex justify-center">For New User</div>
          </section>
          <section className="size-full mt-12 font-PyeojinGothicB flex flex-col gap-6">
            <div className="px-24">
              <input id="username" type="text" placeholder="USERNAME" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24">
              <input id="password" type="password" placeholder="PASSWORD" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24">
              <input id="realname" type="text" placeholder="REALNAME" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24 flex flex-col gap-4">
              <div className="flex gap-2">
                <input id="email" type="email" placeholder="EMAIL" className="w-4/5 h-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
                <button type="button" className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg">
                  Send
                </button>
              </div>
              <div className="flex gap-2">
                <input id="verifyCode" type="text" placeholder="VERIFY CODE" className="w-4/5 h-full px-4 py-2 text-xl border-2 border-gray-400 rounded-lg" />
                <button type="button" className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg">
                  Verify
                </button>
              </div>
            </div>
            <div className="px-24">
              <input id="phone" type="text" placeholder="PHONE" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24">
              <input id="ssn" type="text" placeholder="SSN" className="size-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
            </div>
            <div className="px-24 flex flex-col gap-4">
              <div className="flex gap-2">
                <input id="address1" type="text" placeholder="ADDRESS" className="w-4/5 h-full p-4 text-xl border-2 border-gray-400 rounded-lg" />
                <button type="button" className="w-1/5 h-full text-xl text-white bg-saintragreen rounded-lg">
                  Search
                </button>
              </div>
              <div className="">
                <input id="address2" type="text" placeholder="ADDRESS DETAIL" className="size-full px-4 py-2 text-xl border-2 border-gray-400 rounded-lg" />
              </div>
            </div>
          </section>
          <section className="mt-12">
            <button type="submit" className="w-48 h-20 text-3xl text-white bg-saintragreen rounded-xl">
              Register
            </button>
          </section>
          <section className="my-12 text-lg text-gray-500">
            <div>Go Back to Authenticator</div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Register;
