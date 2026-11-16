(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const publishedTutorials = () =>
    (window.ACADEMIA_TUTORIALS ?? []).filter((tutorial) => tutorial.status !== "soon");

  const tutorialHaystack = (tutorial) =>
    MentorAI.normalize(
      [
        tutorial.title,
        tutorial.description,
        tutorial.topic,
        (tutorial.categories ?? []).join(" "),
        (tutorial.tags ?? []).join(" "),
      ].join(" ")
    );

  const collectionHaystack = (collection) => MentorAI.normalize(`${collection.title} ${collection.summary ?? ""}`);

  function byRelevance(items, terms) {
    const hasTermsInTitle = (item) => MentorAI.containsAllTerms(MentorAI.normalize(item.title), terms);

    return [...items.filter(hasTermsInTitle), ...items.filter((item) => !hasTermsInTitle(item))];
  }

  function matching(items, haystackOf, terms) {
    return byRelevance(
      items.filter((item) => MentorAI.containsAllTerms(haystackOf(item), terms)),
      terms
    );
  }

  function find(terms) {
    const inMetadata = matching(publishedTutorials(), tutorialHaystack, terms);
    const foundInMetadata = new Set(inMetadata.map((tutorial) => tutorial.slug));

    return {
      paths: matching(window.MENTORAI_PATHS ?? [], collectionHaystack, terms),
      courses: matching(window.MENTORAI_COURSES ?? [], collectionHaystack, terms),
      inMetadata,
      inContent: publishedTutorials().filter(
        (tutorial) => !foundInMetadata.has(tutorial.slug) && MentorAI.Search.coincide(tutorial.slug, terms)
      ),
    };
  }

  MentorAI.SearchEngine = { byRelevance, find };
})();
