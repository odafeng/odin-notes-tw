"""掃描 docs/ 下所有講義的 frontmatter，重寫首頁的進度區塊。"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from pathlib import Path

import yaml

DOCS = Path(__file__).resolve().parent.parent / "docs"
INDEX = DOCS / "index.md"
START, END = "<!-- PROGRESS:START -->", "<!-- PROGRESS:END -->"

# 課程依 TOP 學習路線順序排列（首頁目錄用），而非字母序。
COURSE_ORDER = [
    "Foundations",
    "Intermediate HTML and CSS",
    "JavaScript",
    "Advanced HTML and CSS",
    "React",
    "Databases",
    "NodeJS",
    "Getting Hired",
]


def course_rank(course: str) -> int:
    return COURSE_ORDER.index(course) if course in COURSE_ORDER else len(COURSE_ORDER)


@dataclass
class Lecture:
    title: str
    path: str
    course: str
    order: int
    rel_url: str


def parse_frontmatter(md: Path) -> dict | None:
    text = md.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    data = yaml.safe_load(text[3:end])
    return data if isinstance(data, dict) else None


def collect() -> list[Lecture]:
    lectures: list[Lecture] = []
    for md in sorted(DOCS.rglob("*.md")):
        if md.name == "index.md" or "about" in md.parts:
            continue
        fm = parse_frontmatter(md)
        if not fm or "course" not in fm:
            continue
        lectures.append(
            Lecture(
                title=str(fm.get("title", md.stem)),
                path=str(fm.get("path", "")),
                course=str(fm["course"]),
                order=int(fm.get("order", 0)),
                rel_url=md.relative_to(DOCS).as_posix(),
            )
        )
    lectures.sort(key=lambda lec: (course_rank(lec.course), lec.order))
    return lectures


def render(lectures: list[Lecture]) -> str:
    if not lectures:
        return "（課程目錄整理中。）"
    lectures = sorted(lectures, key=lambda lec: (course_rank(lec.course), lec.order))
    total = len(lectures)
    lines = [
        f'你已讀 <span class="od-read-count" data-total="{total}">0</span>／{total} 課'
        f" · 更新於 {date.today().isoformat()}",
        "",
        "在任一課頁面點「標記為已讀」、或在課程清單點核取方塊就會記住"
        "（存在你的瀏覽器，換裝置各自計算）。",
        "",
    ]
    current: str | None = None
    for lec in lectures:
        if lec.course != current:
            if current is not None:
                lines += ["", "</details>", ""]
            current = lec.course
            lines += [
                '<details class="od-course" markdown>',
                f'<summary>{current}<span class="od-course-progress"></span></summary>',
                "",
            ]
        lines.append(f"- [{lec.title}]({lec.rel_url})")
    if current is not None:
        lines += ["", "</details>"]
    return "\n".join(lines)


def main() -> None:
    text = INDEX.read_text(encoding="utf-8")
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    INDEX.write_text(f"{head}{START}\n{render(collect())}\n{END}{tail}", encoding="utf-8")
    print(f"更新 {INDEX.relative_to(DOCS.parent)}")


if __name__ == "__main__":
    main()
