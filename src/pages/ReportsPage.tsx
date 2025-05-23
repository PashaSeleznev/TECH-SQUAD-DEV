import { type FC } from "react";
import type { UserType } from "../App";

type ReportsPageProps = {
  logUser: UserType,
  apiUrl: string
};

const ReportsPage: FC<ReportsPageProps> = ({ logUser, apiUrl }) => {
  return (
    <div className="reports-page">
      <div className="reports-page-heading">
        Ваши отчеты
      </div>
      <div className="reports-area">
        {logUser.reports && logUser.reports.length > 0 ? (
          (logUser.reports || []).slice().reverse().map((filename, idx) => (
            <div key={idx}>
              <a className="reports-file"
                href={`${apiUrl}/reports/${filename}`}
                target="_blank"
              >
                📄 {filename}
              </a>
            </div>
          ))
        ) : (
          <div>
            У вас нет загруженных отчетов
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
