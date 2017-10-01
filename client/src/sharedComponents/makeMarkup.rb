passage0 = "I just didn\\\'t feel like doing anything much for the rest of the day. Mike went out with his friends so I stayed up in my room and played, building a neat castle and fighting a war with the plastic knights my mother had gotten for me. I made one Merlin The Magician. That was Saturday. The next morning, Sunday, we had our usual family breakfast, about the only time the bunch of us get to sit down and take as long as we want. About halfway through my mother said, \\\"I have an idea.\\\"\n \\\"Maybe we should get you another bike,\\\" she said. \\\"Mr. Bullen is open on Sundays. I\\\'m sure we could find one.\\\" \\\"What happens if he finds the one he lost?\\\" asked Mike. \\\"I doubt very much if he will,\\\" my father said. \\\"Mr. Podler said he saw someone with it,\\\" I reminded him. \\\"We all know about Mr. Podler,\\\" was my father\\\'s answer to that. \\\"Someday I\\\'ll tell you about the ghosts he saw in City Hall.\\\" \\\"Don\\\'t you want a bike?\\\" my mother asked. Mike\\\'s question was the right one. \\\"What happens if my old one turns up?\\\" I asked. \\\"We\\\'ll worry about that if it happens,\\\" suggested my mom. \\\"It\\\'s up to you. We can get one if you want.\\\" \\\"If I do get a new one, does that mean I have to stop looking for the old one?\\\" I wanted to know. \\\"I don\\\'t see much point in looking,\\\" said my father. \\\"But if you want to, there\\\'s no one saying you can\\\'t.\\\" \\\"Okay, I\\\'ll get one.\\\" \\\"I\\\'ll go with you,\\\" Mike said suddenly. \\\"I need some radio parts.\\\" It was eleven when my mother, Mike with his radio parts box, and I got into the car and drove to Mr. Bullen\\\'s junk yard a little way out of town. My mother has always had a particular liking for Mr. Bullen, and since she likes junk, it\\\'s not hard to see why. The lot is something kind of hard to describe. It has just about everything in the world piled up in heaps, piled up so much that it\\\'s hard to find anything. There are some sections, such as shutters, or bathtubs, but aside from those, you just have to go looking and there are more hiding places there than anywhere else."

passage1 =  "The moon is high and the stars are bright. Daddy tells me, \\\"It\\\'s a firefly night!\\\"" + "\n" + 
        "Fireflies shine. All of them glow. I race to show Daddy their dancing light show." + "\n" +
        "I open my jar. They fly away quickly and shine. I love catching fireflies, but they are not mine."

passage2 = "Nick was looking at his book. His mom came in and said, \\\"It’s time for bed.\\\" \\\"Okay, Mom,\\\" said Nick.\n\nNick put on his pajamas. He washed his face and brushed his teeth. He was ready for bed.\n\n\\\"Will you read me a story?\\\" Nick asked his mom. Mom read the story to Nick. Nick liked the story about the magic fish.\n\nWhen the story was over, Nick\\\'s mom turned off the light. \\\"Good night, Nick,\\\" his mom said.\n\n\\\"Will you turn on the nightlight?\\\" asked Nick. \\\"Okay, Nick,\\\" his mom said. She turned it on.\n\n\\\"Good night, Nick,\\\" his mom said. \\\"Now it’s time to go to sleep.\\\"   \\\"I can’t go to sleep,\\\" said Nick. \\\"I will give you a good night kiss,\\\" said Nick\\\'s mom\n\n\\\"I can’t go to sleep,\\\" said Nick. \\\"Will you open the door?\\\" he asked. Nick’s mom opened the door. Light came into the room.\n\n\\\"Good night, Nick,\\\" his mom said. \\\"Go to sleep now.\\\" \\\"I can\\\'t go to sleep,\\\" said Nick. \\\"Something is missing.\\\"\n\nHe looked around the room. Something came in the door. \\\"Wags! You’re late,\\\" said Nick.  \\\"Now we can go to sleep.\n\n\\\"Good night, Nick,\\\" said Mom. \\\"Good night, Wags.\\\" \\\"Good night, Mom,\\\" said Nick."

passage3 = "My name is Peter. I\\\'m upside down.\n\nThings look different upside down. Here is my name upside down.\n\nI see the living room upside down. Everything looks funny!\n\nI toss a ball. Does it fall up? Or down?\n\nWho is at the door? Wow! It\\\'s my friend, Jill! But her feet are up, not down. Will her hat fall off?\n\n\\\"Jill, do you want to play upside down with me? Being upside down is fun!\\\""


puts "export var newSampleEvaluationText = {
  readingEndIndex: {
    paragraphIndex: 999, // -1
    wordIndex: 999, // -1
  },
  paragraphs: [
"


 passage3.split("\n\n").each_with_index do |paragraph, idx|
  puts "\t\{\n\t\tkey: \'#{'fake_key_' + idx.to_s}\',\n\t\twords: \[\n" # the top 
    for wrd in paragraph.split do
      puts "\t\t\{\n\t\t\tword: \'#{wrd}\'\,\n\t\t\twordDeleted: false\,\n\t\t\tsubstituteWord: null\,\n\t\t\taddAfterWord: null\,\n\t\t\tmTypeError: false\,\n\t\t\tsTypeError: false\,\n\t\t\tvTypeError: false\,\n\t\t\}\,\n"
    end 
  puts "\t\],\n\t\},\n" # the top 
end

puts "  ],
}
"

