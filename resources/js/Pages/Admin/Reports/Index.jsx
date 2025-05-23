import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head , Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
export default function Index({ reports }) {
  const handleDeletePost = (reportId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      router.delete(`/admin/reports/${reportId}/delete-post`);
    }
  };
    return (
        <AuthenticatedLayoutAdmin
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    📣 Reported Post
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            

          {reports.data.map((report) => (
            <div key={report.id} className="p-4 border rounded">
              <p className="text-sm text-gray-700">
                <strong>Post URL:</strong>{' '}
                <a
                  href={report.post_url}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {report.post_url}
                </a>
              </p>
              <p className="mt-1">
                <strong>Reason:</strong> {report.reason}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Reported post author:{' '}
                <strong>{report.post?.user?.name || 'Deleted user'}</strong>
              </p>
    
              <button
                onClick={() => handleDeletePost(report.id)}
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete Post
              </button>
            </div>
          ))}
    
          {/* Optional Pagination */}
          {reports.next_page_url && (
            <button
              onClick={() =>
                router.visit(reports.next_page_url, {
                  preserveScroll: true,
                  only: ['reports'],
                })
              }
              className="text-blue-500 underline mt-4"
            >
              Load more...
            </button>
          )}
    
                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
