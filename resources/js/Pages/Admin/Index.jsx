import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head , Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayoutAdmin
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            

                        <div className="grid grid-cols-2 grid-rows-4 gap-4">
    <div > 
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-5 h-min flex items-center max-w-full py-8 px-4 dark:border-zinc-800">
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full min-h-[68px] min-w-[68px]">
        <img
          className="aspect-square h-full w-full"
          src="/assets/images/admin/report_admin.png"
          alt="Profile"
        />
      </span>
      <div>
        <p className="text-xl font-extrabold text-zinc-950 leading-[100%] dark:text-white pl-4 md:text-3xl">
         Posts Reports
        </p>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-2 pl-4 md:text-base">
          <Link href={route('admin.reports.index')} className="text-blue-500 hover:underline">Click here to view all posts reports</Link>
        </p>
      </div>
    </div>
    </div>
    <div >
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-5 h-min flex items-center max-w-full py-8 px-4 dark:border-zinc-800">
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full min-h-[68px] min-w-[68px]">
        <img
          className="aspect-square h-full w-full"
          src="/assets/images/admin/Users_admin.png"
          alt="Profile"
        />
      </span>
      <div>
        <p className="text-xl font-extrabold text-zinc-950 leading-[100%] dark:text-white pl-4 md:text-3xl">
         Users Action
        </p>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-2 pl-4 md:text-base">
          <Link href={route('admin.users.index')} className="text-blue-500 hover:underline">Click here to view all Users</Link>
        </p>
      </div>
    </div>
    </div>
    <div >
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-5 h-min flex items-center max-w-full py-8 px-4 dark:border-zinc-800">
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full min-h-[68px] min-w-[68px]">
        <img
          className="aspect-square h-full w-full"
          src="/assets/images/admin/setting_admin.png"
          alt="Profile"
        />
      </span>
      <div>
        <p className="text-xl font-extrabold text-zinc-950 leading-[100%] dark:text-white pl-4 md:text-3xl">
         App Setting
        </p>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-2 pl-4 md:text-base">
          <Link href={route('admin.setting.index')} className="text-blue-500 hover:underline">Click here to view app setting</Link>
        </p>
      </div>
    </div>
    </div>
    <div >
      
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-5 h-min flex items-center max-w-full py-8 px-4 dark:border-zinc-800">
      <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full min-h-[68px] min-w-[68px]">
        <img
          className="aspect-square h-full w-full"
          src="/assets/images/admin/UsernameUnregister_admin.png"
          alt="Profile"
        />
      </span>
      <div>
        <p className="text-xl font-extrabold text-zinc-950 leading-[100%] dark:text-white pl-4 md:text-3xl">
        UsernameUnregister
        </p>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-2 pl-4 md:text-base">
          <Link href={route('admin.usernameunregister.index')} className="text-blue-500 hover:underline">Click here to add UsernameUnregister</Link>
        </p>
      </div>
    </div>

    </div>
    {/* <div >5</div>
    <div >6</div>
    <div >7</div>
    <div >8</div>
    <div >9</div>
    <div >10</div>
    <div >11</div>
    <div >12</div> */}
                        </div>
    
    
                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
