import { describe, expect, test } from "bun:test";
import { parseArticleContentBlocks } from "./article-content";

describe("parseArticleContentBlocks", () => {
  test("separates a local video marker from surrounding markdown", () => {
    const blocks = parseArticleContentBlocks(`# Opening

Before the film.

[[video:/videos/hey-charlie.mp4|/images/hey-charlie.jpg|The Hey Charlie Experience]]

## After

Back on the water.`);

    expect(blocks).toEqual([
      { type: "markdown", content: "# Opening\n\nBefore the film." },
      {
        type: "video",
        src: "/videos/hey-charlie.mp4",
        poster: "/images/hey-charlie.jpg",
        title: "The Hey Charlie Experience",
      },
      { type: "markdown", content: "## After\n\nBack on the water." },
    ]);
  });

  test("leaves external or malformed video markers as article text", () => {
    const marker = "[[video:https://example.com/video.mp4||External video]]";
    expect(parseArticleContentBlocks(marker)).toEqual([{ type: "markdown", content: marker }]);
  });
});
