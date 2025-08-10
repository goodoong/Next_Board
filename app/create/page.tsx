import { Button } from "@/components/ui/button";
import styles from "./page.module.scss";
import { Progress } from "@/components/ui/progress";
import LabelCalendar from "@/components/common/calendar/LabelCalendar";
import Image from "next/image";
import BasicBoard from "@/components/common/board/BasicBoard";
function page() {
  return (
    <div className={styles.container}>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            placeholder="Enter Title Here"
            className={styles.input}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그레스 바 UI */}
            <Progress
              value={33}
              className="w-[40%] h-2"
              indicatorColor="bg-green-500"
            />
          </div>
          <div className={styles.calendarBox}>
            <div className={styles.calendarBox__calendar}>
              {/* 캘린더 UI */}
              <LabelCalendar label="From" readonly={true} />
              <LabelCalendar label="To" />
            </div>
            <Button
              variant={"outline"}
              className="w-[15%] border-emerald-400 bg-emerald-400 text-white hover:bg-emerald-600  hover:text-white"
            >
              Add New Board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        <div className={styles.container__body__infoBox}>
          <span className={styles.title}>There is no board yet</span>
          <span className={styles.subTitle}>
            Click the button and start flashing!
          </span>
          <button className={styles.button}>
            <Image
              src="/assets/img/plus-button.svg"
              alt="plus-button"
              width={100}
              height={100}
            />
          </button>
        </div>
        <BasicBoard />
      </main>
    </div>
  );
}

export default page;
