import re

with open('src/data/blogPosts.js', 'r') as f:
    content = f.read()

# Define pools of unique Unsplash photo IDs. Total needed: 60
# I will supply 60 completely distinct IDs.
unsplash_ids = [
    # 3D Printing / STL / CAD (15 needed)
    "1607252650355-f7fd0460ccdb", "1544396821-4dd40b938ad3", "1593642632823-8f785ba67e45",
    "1626379953822-baec19c3accd", "1627398242454-45a1465c2479", "1677442136019-21780ecad995",
    "1581092543594-5cb391e9b252", "1631017004898-80e6e46bfc1c", "1620612668541-b8449c25603e",
    "1518770660439-4636190af475", "1517077304055-6e87aedba4eb", "1611082530182-14227009386c",
    "1615556947231-152e82f1b8c1", "1581092921461-82086fc50a1b", "1615556948512-eb26c11c5211",
    "1600101859702-86ee2b20cc5b", "1591559891040-cfc6c4c6ee38", "1602738450148-52fb58f62f83",

    # Software / Tools / Developer (20 needed)
    "1551650975-87deedd944c3", "1558494949-ef010cbdcc31", "1484807352052-23338990c6c6",
    "1461749280684-dccba630e2f6", "1585771724684-38269d6639fd", "1635070041078-e363dbe005cb",
    "1498050108023-c5249f4df085", "1522881115148-d75ee5fb482d", "1504639725590-34d0984388bd",
    "1488590528505-98d2b5aba04b", "1499951360447-b19be8fe80f5", "1555066931-4365d14bab8c",
    "1542831371229-5bc0bcbabb26", "1504868584819-ebb8e192c72b", "1498050108023-c5249f4df085", # duplicate! replaced below
    "1516321497487-e288fb19713f", "1507721999472-8ed4421c4af2", "1460925895917-afdab827c52f",
    "1531403009284-440f080d1e12", "1454165804606-c3d57bc86b40", "1523800585698-1e43b1f51bdc",
    "1510915228340-2f183764b859", "1517694712202-14dd9538aa97", "1480694313141-fce5e697ee25",

    # Android / APK / Mobile (15 needed)
    "1563986768609-322da13575f3", "1618401471353-b98afee0b2eb", "1501504905252-473c47e087f8",
    "1676543765086-51756a5d1c47", "1617791160536-598cf32026fb", "1511707171634-5f8c7b670f5e",
    "1520607164081-9b09bc29ff31", "1551288049-bebda4e38f71", "1533228100845-08145a01de14",
    "1555774698-0b65e048a1d7", "1598327105666-5e581284d728", "1512941937669-90a1b58e7e9c",
    "1526406915894-7bcd65f60845", "1589492477829-8e6eafe5d16d", "1521939094609-93aba1b18d2b",
    "1592899677977-9c10ca588bb6", "1585060544812-6b45742d762f",

    # Technology / AI / Web (15 needed)
    "1573804633927-bfcbcd909acd", "1633356122102-3fe601e05bd2", "1620712943543-bcc4688e7485",
    "1451187580459-43490279c0fa", "1485827404703-89b55fcc595e", "1451186850207-c963625295c3",
    "1519389953810-c5caa141b714", "1550751827-4bd374c3f58b", "1525338078858-d762b5e32f2c",
    "1535223289827-42f1e9911c00", "1515879218367-8466d910aaa4", "1550745165-9bc0b252726f",
    "1531297122-e6ce0939ef6c", "1518770660439-4636190af475", "1504384308090-c894fdcc538d",
    "1525547719571-a2d4ac8945e2"
]

# Ensure uniqueness and sufficient length
unique_ids = list(dict.fromkeys(unsplash_ids))
print(f"Total unique photo IDs available: {len(unique_ids)}")

pool = unique_ids.copy()

def replace_thumb(match):
    if not pool:
        return match.group(0) # Not enough IDs
    new_id = pool.pop(0)
    return f"thumbnail: 'https://images.unsplash.com/photo-{new_id}?w=800&q=80&auto=format&fit=crop',"

new_content = re.sub(r"thumbnail:\s*'https://images\.unsplash\.com/photo-[^?]+\?w=800&q=80&auto=format&fit=crop',", replace_thumb, content)

with open('src/data/blogPosts.js', 'w') as f:
    f.write(new_content)

print(f"Thumbnails replaced. Remaining in pool: {len(pool)}")
