import "./../styles/classroom.css";

import NoteSection from "../components/NoteSection";
import PollSection from "../components/PollSection";
import ChatSection from "../components/ChatSection";

function ClassroomPage() {

  const sessionId =
    localStorage.getItem(
      "sessionId"
    );

  return (
    <div className="classroom-page">

      <div className="classroom-header">

        <div className="classroom-title">
          Live Classroom Platform
        </div>

        <div className="classroom-subtitle">
          Session ID: {sessionId}
        </div>

      </div>

      <div className="classroom-layout">

        <div className="classroom-sidebar">

          <div className="card">

            <div className="section-title">
              Participants
            </div>

            <div>
              teacher@test.com
            </div>

            <div>
              student@test.com
            </div>

          </div>

        </div>

        <div className="classroom-content">

          <div className="card">
            <NoteSection />
          </div>

          <div className="card">
            <PollSection />
          </div>

          <div className="card">
            <ChatSection />
          </div>

        </div>

      </div>

    </div>
  );
}

export default ClassroomPage;